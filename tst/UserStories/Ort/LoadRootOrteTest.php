<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;

require_once(__DIR__."/../../../UserStories/Ort/LoadRootOrte.php");

final class LoadRootOrteTest extends TestCase
{
    public function testLoadRootOrte()
    {
        $loadRootOrte = new LoadRootOrte();

        $this->assertTrue($loadRootOrte->run());
        $this->assertCount(5, $loadRootOrte->getRootOrte());
        $this->assertInstanceOf(Ort::class, $loadRootOrte->getRootOrte()[0]);
    }
}
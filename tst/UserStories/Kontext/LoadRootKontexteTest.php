<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;

require_once(__DIR__."/../../../src/UserStories/Kontext/LoadRootKontexte.php");

final class LoadRootKontexteTest extends TestCase
{
    public function testLoadRootKontexte()
    {
        $loadRootKontexte = new LoadRootKontexte();

        $this->assertTrue($loadRootKontexte->run());
        $this->assertCount(55, $loadRootKontexte->getRootKontexte());
        $this->assertInstanceOf(Kontext::class, $loadRootKontexte->getRootKontexte()[0]);
    }
}